export type Feedback = {
  id: string
  user_id: string
  title: string
  body: string
  created_at: string
}

export type FeedbackComment = {
  id: string
  feedback_id: string
  body: string
  created_at: string
}

export type FeedbackWithProfile = Feedback & {
  nickname: string
  email: string
}

export type FeedbackDetail = FeedbackWithProfile & {
  comments: FeedbackComment[]
}

export type MyFeedback = Feedback & {
  comments: FeedbackComment[]
}
