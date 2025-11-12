// 提交表单的字段类型
export interface SubmitFormData {
  title: string;
  doi: string;
  email: string;
  author: string;
}

// 后端返回的文献数据类型
export interface Submission extends SubmitFormData {
  _id: string;
  status: 'pending';
  createdAt: string;
}