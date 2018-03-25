import * as React from 'react';

export const Score = ({ score }) => (
  <div className="black bg-react-blue flex items-end mb4 ph3 pv1 shadow-react-blue">
    <div className="f6 fw3 mr2">SCORE</div>
    <div className="f2">{ score }</div>
  </div>
);
