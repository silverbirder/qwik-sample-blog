import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Panda } from "./panda";

const meta: Meta = {
  component: Panda,
};

type Story = StoryObj;

export default meta;

export const Primary: Story = {
  render: (props) => <Panda {...props}></Panda>,
};
