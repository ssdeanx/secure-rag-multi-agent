import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { registerSheet, unregisterSheet, notifyOpen } from './sheet-manager'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  // If the consumer controls `open` via props and provides `onOpenChange`, we wrap
  // the onOpenChange to notify other sheets when this one opens.
  const id = React.useId()

  const { onOpenChange } = props as any

  React.useEffect(() => {
    // register a close function if the consumer provided a way to close (via onOpenChange)
    const closeFn = () => onOpenChange?.(false)
    registerSheet(id, closeFn)
    return () => unregisterSheet(id)
  }, [id, onOpenChange])

  const handleOpenChange = (open: boolean) => {
    if (open) notifyOpen(id)
    onOpenChange?.(open)
  }

  return <SheetPrimitive.Root data-slot="sheet" {...props} onOpenChange={handleOpenChange} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  // detect if a Title is provided by the consumer to avoid rendering a duplicate
  const childrenArray = React.Children.toArray(children);
  const hasTitle = childrenArray.some((child) =>
    React.isValidElement(child) &&
    (child.type === SheetPrimitive.Title || ((child.props as any)?.['data-slot'] === 'sheet-title'))
  );
  // detect if a Description is provided
  const hasDescription = childrenArray.some((child) =>
    React.isValidElement(child) &&
    (child.type === SheetPrimitive.Description || ((child.props as any)?.['data-slot'] === 'sheet-description'))
  );
  const id = React.useId();
  const ariaDescribedBy = (props as any)['aria-describedby'] || (!hasDescription ? `${id}-desc` : undefined);
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {/* If the consumer hasn't provided a title, render a visually hidden one for accessibility */}
        {!hasTitle && (
          <SheetPrimitive.Title className="sr-only">Dialog</SheetPrimitive.Title>
        )}
        {/* If the consumer hasn't provided a description, render a visually hidden one and ensure aria-describedby points to it */}
        {!hasDescription && (
          <SheetPrimitive.Description id={`${id}-desc`} className="sr-only">
            Dialog content
          </SheetPrimitive.Description>
        )}
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
