export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="h-screen w-screen fixed z-50 bg-dark-2 top-0 left-0 flex items-center justify-center">
      <span className="loader" />
    </div>
  );
}
