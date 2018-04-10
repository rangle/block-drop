import * as React from 'react';

export const Score = ({ score }) => (
  <div
    className="blue-black bg-react-blue flex 
      items-end mb2 mb4-ns ph2 ph3-ns pv1 shadow-react-blue"
  >
    <div className="f6 f4-ns calibre-light mr2 mr3-ns mb2-ns">SCORE</div>
    <div className="f3 f2-m f1-l mt1 mt2-m mt3-l">{score}</div>
  </div>
);
