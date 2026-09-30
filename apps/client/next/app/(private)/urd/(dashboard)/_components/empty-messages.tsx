import React from 'react';

function EmptyMessages(props: { handleClick: (message: string) => void }) {
  const options = [
    'How do starts form?',
    'How to get started?',
    "Tell me about Nepal's political landscape?",
  ];
  return (
    <div className="size-full grid place-items-center">
      <div className="flex items-center flex-col gap-5">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-center text-3xl font-bold">Welcome! No messages yet.</h1>
          <p className="text-center text-muted-foreground">
            Please ask a question to get started or choose a topic from the list.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {options.map((option) => (
            <Option onClick={() => props.handleClick(option)} key={option} label={option} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Option(props: { onClick: VoidFunction; label: string }) {
  return (
    <button
      onClick={props.onClick}
      className="size-max border-border bg-card p-4 rounded-lg text-sm shadow-sm hover:bg-card/50"
    >
      {props.label}
    </button>
  );
}
export default EmptyMessages;
