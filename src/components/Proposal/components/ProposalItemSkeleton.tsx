export function ProposalItemSkeleton() {
  return (
    <div className="group/proposal-item flex animate-pulse cursor-pointer flex-col divide-y divide-subtle-light rounded-xl bg-subtle p-4 duration-150 hover:ring-1 hover:ring-accent-dark group-data-[view=list]/proposal-root:md:flex-row group-data-[view=list]/proposal-root:md:divide-y-0">
      <div className="flex-1 space-y-4 p-4">
        <div className="h-7 w-3/4 rounded-md bg-ui-element" />
        <div className="py-1">
          <div className="my-1 h-4 w-full rounded-md bg-ui-element" />
          <div className="my-1 h-4 w-full rounded-md bg-ui-element" />
          <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
        </div>
        <div className="h-9 w-28 rounded-full bg-ui-element" />
      </div>
      <div className="mx-4 flex-1 divide-y divide-subtle-light">
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 gap-4">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
          </div>
          <div className="flex flex-1 gap-4">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
          </div>
        </div>
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 gap-4">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
          </div>
          <div className="flex flex-1 gap-4">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
          </div>
        </div>
        <div className="flex gap-4 py-4">
          <div className="flex flex-1 gap-4">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
          </div>
          <div className="flex flex-1 gap-4">
            <div className="h-6 w-6 rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
          </div>
        </div>
      </div>
    </div>
  );
}
