import React from 'react';

export default function NodeShape({inferred}: {inferred: boolean}) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {inferred ? (
        <>
          <path d="M7 12v17c0 7 26 7 26 0V12" strokeDasharray="3 2" />
          <ellipse cx="20" cy="12" rx="13" ry="6" />
        </>
      ) : (
        <>
          <path d="m20 2 16 9v18L20 38 4 29V11Z" />
          <path d="m20 11 8 4.5v9L20 29l-8-4.5v-9Z" opacity=".6" />
        </>
      )}
    </svg>
  );
}
