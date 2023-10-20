export function ProfileCardSkeleton() {
  return (
    <div className="animate-pulse space-y-8 rounded-xl bg-subtle p-8 duration-150">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-none rounded-full bg-ui-element" />
        <div className="flex-1">
          <div className="mb-2 mt-1 h-5 w-1/2 rounded-md bg-ui-element" />
          <div className="my-1 h-4 w-1/3 rounded-md bg-ui-element" />
        </div>
      </div>
      <div>
        <div className="my-1 h-3.5 w-28 rounded-md bg-ui-element" />
        <div className="py-1">
          <div className="my-[0.4375rem] h-[1.125rem] w-full rounded-md bg-ui-element" />
          <div className="my-[0.4375rem] h-[1.125rem] w-1/2 rounded-md bg-ui-element" />
        </div>
      </div>
      <div>
        {[1, 2, 3, 4].map(item => (
          <div key={item} className="flex justify-between gap-4 border-t border-subtle-light py-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="h-6 w-6 rounded-md bg-ui-element" />
              <div className="my-1 h-4 w-1/4 rounded-md bg-ui-element" />
            </div>
            <div className="my-1 h-4 w-1/4 rounded-md bg-ui-element" />
          </div>
        ))}
      </div>
    </div>
  );
}
