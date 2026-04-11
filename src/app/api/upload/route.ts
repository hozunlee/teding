import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  const videoId = form.get('videoId') as string | null

  if (!file || !videoId) {
    return Response.json({ error: 'file and videoId required' }, { status: 400 })
  }

  const path = `${user.id}/${videoId}/annotated_${Date.now()}.pdf`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('worksheets')
    .upload(path, file, { contentType: 'application/pdf' })

  if (storageError) return Response.json({ error: storageError.message }, { status: 500 })

  const { error: dbError } = await supabase.from('user_uploads').insert({
    user_id: user.id,
    video_id: videoId,
    file_url: storageData.path,
    file_name: file.name,
  })
  if (dbError) return Response.json({ error: dbError.message }, { status: 500 })

  return Response.json({ path: storageData.path })
}
