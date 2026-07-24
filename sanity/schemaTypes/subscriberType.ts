import { defineField, defineType } from "sanity";
import { BellIcon } from "@sanity/icons";

export const subscriberType = defineType({
  name: "subscriber",
  title: "Notification Subscriber",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "email",
      type: "string",
      validation: (rule) => [
        rule.required().error("Email is required"),
        rule.email().error("Must be a valid email address"),
      ],
    }),
    defineField({
      name: "subscribedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "subscribedAt" },
  },
});