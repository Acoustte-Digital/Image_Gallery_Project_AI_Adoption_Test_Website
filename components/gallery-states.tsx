type MessageStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

function MessageState({ title, description, action }: MessageStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState() {
  return <MessageState title="Loading images..." description="Please wait while we fetch the gallery." />;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <MessageState
      title="Unable to load images"
      description={message}
      action={
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Try again
        </button>
      }
    />
  );
}

export function EmptyState() {
  return <MessageState title="No images found" description="Try a different search or category filter." />;
}
