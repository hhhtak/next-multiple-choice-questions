import { Field, QuestionItem } from "@/types";

export function buildQuestionId(
  field: Field,
  item: Pick<QuestionItem, "id" | "category" | "question">
): string {
  if (item.id?.trim()) {
    return item.id.includes(":") ? item.id : `${field}:${item.id}`;
  }
  return `${field}:${item.category}:${item.question}`;
}

export function withFieldMeta(field: Field, item: QuestionItem): QuestionItem {
  return {
    ...item,
    field,
    id: buildQuestionId(field, item),
  };
}

export function getQuestionKey(question: QuestionItem): string {
  if (question.field) {
    return buildQuestionId(question.field, question);
  }
  return question.id || `${question.category}:${question.question}`;
}
