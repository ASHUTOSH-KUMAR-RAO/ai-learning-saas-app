'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    
    if (!author) throw new Error('User not authenticated');
    
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .insert({ ...formData, author })
        .select();

    if (error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}

export const getAllCompanion = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    if (subject && topic) {
        query = query
            .ilike('subject', `%${subject}%`)
            .ilike('topic', `%${topic}%`);
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`);
    } else if (topic) {
        query = query.ilike('topic', `%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companion, error } = await query;

    if (error) throw new Error(error.message || 'Failed to fetch companions');

    return companion;
}

export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    if (error || !data) {
        throw new Error(error?.message || 'Companion not found');
    }
    
    return data[0];
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    
    if (!userId) throw new Error('User not authenticated');
    
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
        .from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId
        });

    if (error) throw new Error(error.message);

    return data;
}

export const getRecentSession = async (limit = 10) => {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id(*)`)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserSession = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id(*)`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserCompanion = async (userId: string) => {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq("author", userId);

    if (error) throw new Error(error.message);

    return data;
}