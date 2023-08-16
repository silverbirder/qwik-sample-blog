import type { Meta, StoryObj } from "storybook-framework-qwik";
import { PostSummaryList, PostSummaryListProps } from "./post-summary-list";

const meta: Meta<PostSummaryListProps> = {
  component: PostSummaryList,
};

type Story = StoryObj<PostSummaryListProps>;

export default meta;

export const Primary: Story = {
  args: {
    data: [
      {
        title: "title",
        description: "description",
        permalink: "permalink",
        date: "2023-01-01",
        tags: [],
        published: true,
      },
    ],
  },
};
