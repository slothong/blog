export type PostDto = {
  data: {
    title: string;
    date: string;
    tags: string[];
  };
  content: string;
};
