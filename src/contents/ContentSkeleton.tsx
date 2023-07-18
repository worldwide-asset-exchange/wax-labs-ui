export function ContentSkeleton() {
  return (
    <div className="mx-auto mt-8 flex max-w-7xl animate-pulse flex-col items-center divide-y divide-subtle-light rounded-xl bg-subtle px-4 py-8 duration-150">
      <div className="flex w-full flex-col gap-4">
        <div className="flex-1 space-y-4 p-4">
          <div className="h-14 w-1/4 rounded-md bg-ui-element" />
          <div className="flex flex-row gap-4 py-4">
            <div className="h-10 w-1/6 rounded-md bg-ui-element" />
            <div className="h-10 w-1/6 rounded-md bg-ui-element" />
            <div className="h-10 w-1/6 rounded-md bg-ui-element" />
          </div>
          <div className="py-2">
            <div className="my-1 h-4 w-full rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-full rounded-md bg-ui-element" />
            <div className="my-1 h-4 w-1/2 rounded-md bg-ui-element" />
          </div>
          <div className="h-10 w-32 rounded-full bg-ui-element" />
        </div>
        <div className="mx-4 flex-1">
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
    </div>
  );
}
