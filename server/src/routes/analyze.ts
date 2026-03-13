import express, { type Request, type Response } from 'express';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { insertAnalysisResultSchema } from '@/storage/database/shared/schema';

const router = express.Router();

// AI 分析时间记录（流式输出）
router.post('/', async (req: Request, res: Response) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid records data' });
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate');
    res.setHeader('Connection', 'keep-alive');

    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );

    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 构建 prompt
    const prompt = `请分析以下工作时间记录，提供以下分析：

1. **工作时间统计**
   - 总工作时长
   - 平均每日工作时长
   - 最长和最短工作日

2. **项目分析**
   - 各项目工作时长占比
   - 项目时间分布

3. **任务分析**
   - 高频任务类型
   - 任务耗时分析

4. **改进建议**
   - 时间管理建议
   - 效率提升建议

工作时间记录数据：
${JSON.stringify(records, null, 2)}

请用清晰的结构化格式回复，使用 Markdown 格式。`;

    const messages = [
      {
        role: 'system' as const,
        content: '你是一位专业的时间管理顾问，擅长分析工作时间数据并提供改进建议。',
      },
      {
        role: 'user' as const,
        content: prompt,
      },
    ];

    try {
      const stream = client.stream(messages, {
        model: 'doubao-seed-1-8-251228',
        temperature: 0.7,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        if (chunk.content) {
          const text = chunk.content.toString();
          fullContent += text;
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }

      // 发送结束标记
      res.write(`data: [DONE]\n\n`);
      res.end();

      // 保存分析结果到数据库
      const clientDb = getSupabaseClient();
      await clientDb.from('analysis_results').insert({
        records_data: records,
        analysis_content: fullContent,
      });
    } catch (streamError: any) {
      console.error('Error in stream:', streamError);
      res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error('Error in analyze:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// 获取所有分析结果
router.get('/results', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('analysis_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching analysis results:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching analysis results:', error);
    res.status(500).json({ error: error.message });
  }
});

// 保存分析结果
router.post('/results', async (req: Request, res: Response) => {
  try {
    const validatedData = insertAnalysisResultSchema.parse(req.body);
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('analysis_results')
      .insert({
        records_data: validatedData.recordsData,
        analysis_content: validatedData.analysisContent,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving analysis result:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ data });
  } catch (error: any) {
    console.error('Error saving analysis result:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除分析结果
router.delete('/results/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    const { error } = await client
      .from('analysis_results')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting analysis result:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting analysis result:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
