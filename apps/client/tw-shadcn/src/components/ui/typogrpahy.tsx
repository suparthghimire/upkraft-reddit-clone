import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      body: "text-xs font-light",
      bodyXSRegular: "font-[400] text-[12px] leading-[18px]",
      h1: "text-4xl font-bold leading-tight",
      h2: "text-3xl font-semibold leading-snug",
      h3: "text-2xl font-semibold leading-snug",
      h4: "text-xl font-medium leading-snug",
      h4Bold: "text-xl font-[700] text-[32px] leading-10",
      h5: "text-lg font-medium leading-snug",
      h6: "text-base font-medium leading-snug",
      // h1: "text-4xl font-bold leading-tight",
      // h2: "text-3xl font-semibold leading-snug",
      // h3: "text-2xl font-semibold leading-snug",
      // h4: "text-xl font-medium leading-snug",
      // h5: "text-lg font-medium leading-snug",
      // h6: "text-base font-medium leading-snug",
      medium: "font-medium",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type Variant = VariantProps<typeof typographyVariants>["variant"];

function getTag(variant: Variant) {
  const componentMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4Bold: "h4",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    body: "p",
    bodyXSRegular: "p",
    medium: "p",
  } as const;

  if (!variant) return "p" as const;

  const component = componentMap[variant];

  if (!component) return "p" as const;

  return component;
}

function Typography(
  props: React.PropsWithChildren<{
    variant?: Variant;
    className?: string;
  }>,
) {
  const { variant = "body", children } = props;

  const Component = getTag(variant) as React.ElementType;

  return (
    <Component
      className={typographyVariants({
        variant,
        className: cn(props.className),
      })}
    >
      {children}
    </Component>
  );
}

export default Typography;
