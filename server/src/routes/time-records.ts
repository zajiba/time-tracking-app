import express, { type Request, type Response } from 'express';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { insertTimeRecordSchema, updateTimeRecordSchema } from '@/storage/database/shared/schema';

const router = express.Router();

// 获取所有时间记录
router.get('/', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('time_records')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching time records:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching time records:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取单条记录
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('time_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching time record:', error);
      return res.status(404).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching time record:', error);
    res.status(500).json({ error: error.message });
  }
});

// 创建时间记录
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = insertTimeRecordSchema.parse(req.body);
    const client = getSupabaseClient();

    // 计算时长（如果提供了开始和结束时间）
    let duration = validatedData.duration;
    if (validatedData.startTime && validatedData.endTime) {
      const start = new Date(`${validatedData.date}T${validatedData.startTime}`);
      const end = new Date(`${validatedData.date}T${validatedData.endTime}`);
      duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60); // 转换为分钟
    }

    const { data, error } = await client
      .from('time_records')
      .insert({
        date: validatedData.date,
        start_time: validatedData.startTime,
        end_time: validatedData.endTime,
        duration: duration,
        project: validatedData.project,
        task: validatedData.task,
        notes: validatedData.notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating time record:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ data });
  } catch (error: any) {
    console.error('Error creating time record:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新时间记录
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateTimeRecordSchema.parse(req.body);
    const client = getSupabaseClient();

    // 计算时长（如果提供了开始和结束时间）
    let duration = validatedData.duration;
    if (validatedData.startTime && validatedData.endTime) {
      const start = new Date(`${validatedData.date || ''}T${validatedData.startTime}`);
      const end = new Date(`${validatedData.date || ''}T${validatedData.endTime}`);
      duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60); // 转换为分钟
    }

    const { data, error } = await client
      .from('time_records')
      .update({
        ...(validatedData.date && { date: validatedData.date }),
        ...(validatedData.startTime && { start_time: validatedData.startTime }),
        ...(validatedData.endTime && { end_time: validatedData.endTime }),
        ...(duration !== undefined && { duration: duration }),
        ...(validatedData.project !== undefined && { project: validatedData.project }),
        ...(validatedData.task !== undefined && { task: validatedData.task }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating time record:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error updating time record:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除时间记录
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    const { error } = await client
      .from('time_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting time record:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting time record:', error);
    res.status(500).json({ error: error.message });
  }
});

// 导出时间记录
router.get('/export/all', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('time_records')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error exporting time records:', error);
      return res.status(500).json({ error: error.message });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=time-records.json');
    res.json({ records: data || [] });
  } catch (error: any) {
    console.error('Error exporting time records:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
