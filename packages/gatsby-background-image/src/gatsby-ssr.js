// Import React so that you can use JSX in HeadComponents
import React from 'react';
import { oneLine } from 'common-tags';

const generateHtml = str => {
  return {
    __html: oneLine(str),
  };
};

const HeadComponents = [
  <style
    key="my-script"
    data-testid="gbi"
    dangerouslySetInnerHTML={generateHtml(
      `.gatsby-image-wrapper { content: 'TEST'; }`
    )}
  />,
];

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents(HeadComponents);
  console.log('HERE!!!!!');
};
