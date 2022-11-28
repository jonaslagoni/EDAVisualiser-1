import React, { useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  EdgeTypesType,
  FlowElement,
} from 'react-flow-renderer';
import { ColumnLayout } from '../../components/layouts';
import nodeTypes from '../../components/react-flow-renderer-nodes';
import FloatingEdge from '../../components/react-flow-renderer-nodes/FloatingEdge';
import { collectChannelConnections } from '../helpers/collect-nodes';

import { ChannelViewData, EdgeType, LayoutProps } from '../../types';

const edgeTypes: EdgeTypesType = {
  floating: FloatingEdge,
};

export interface ChannelViewProps extends ChannelViewData {
  layout?: (
    elements: FlowElement[],
  ) => React.JSXElementConstructor<LayoutProps>;
  sideMenu?: () => React.JSXElementConstructor<any>;
  includeControls?: boolean;
  edgeType?: EdgeType;
}

export const ChannelView: React.FunctionComponent<ChannelViewProps> = ({
  applications,
  channel,
  layout = elementsToLayout => {
    return <ColumnLayout elementsToRender={elementsToLayout} />;
  },
  sideMenu = () => {
    return (
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Event Visualiser</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">Test</span>
      </div>
    );
  },
  includeControls = false,
  edgeType = 'smoothstep',
}) => {
  const [loaded, setLoaded] = useState(false);
  const elements = collectChannelConnections(
    {
      applications,
      channel,
    },
    edgeType as EdgeType,
  );

  const handleLoaded = (reactFlowInstance: any) => {
    setLoaded(true);
    reactFlowInstance.fitView();
  };

  const layoutElement = layout(elements);
  return (
    <section
      className="bg-gray-800 edavisualiser-root"
      style={{ width: '100%', height: '100%' }}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        elements={elements}
        minZoom={0.1}
        onLoad={handleLoaded}
      >
        <Background
          color="#d1d1d3"
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="bg-gray-200"
        />
        {loaded && layoutElement}
        {includeControls && <Controls />}
      </ReactFlow>
      {sideMenu()}
    </section>
  );
};
