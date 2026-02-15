import * as React from 'react';
import { mergeRefs } from './merge-refs';

interface MockNode {
  id: string;
}

describe('mergeRefs', () => {
  it('assigns value to a function ref', () => {
    const ref = jest.fn();
    const merged = mergeRefs<MockNode>(ref);
    const node: MockNode = { id: 'test-node' };

    merged(node);

    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenCalledWith(node);
  });

  it('assigns value to an object ref', () => {
    const ref = React.createRef<MockNode>();
    const merged = mergeRefs<MockNode>(ref);
    const node: MockNode = { id: 'test-node' };

    merged(node);

    expect(ref.current).toBe(node);
  });

  it('handles multiple mixed refs sequentially', () => {
    const functionRef1 = jest.fn();
    const objectRef1 = React.createRef<MockNode>();
    const functionRef2 = jest.fn();
    const objectRef2 = React.createRef<MockNode>();

    const merged = mergeRefs<MockNode>(
      functionRef1,
      objectRef1,
      functionRef2,
      objectRef2,
    );
    const node: MockNode = { id: 'test-node' };

    merged(node);

    expect(functionRef1).toHaveBeenCalledWith(node);
    expect(objectRef1.current).toBe(node);
    expect(functionRef2).toHaveBeenCalledWith(node);
    expect(objectRef2.current).toBe(node);
  });

  it('ignores null and undefined refs gracefully', () => {
    const functionRef = jest.fn();
    const objectRef = React.createRef<MockNode>();

    const merged = mergeRefs<MockNode>(null, functionRef, undefined, objectRef);
    const node: MockNode = { id: 'test-node' };

    merged(node);

    expect(functionRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });

  it('cleans up refs when called with null on unmount', () => {
    const functionRef = jest.fn();
    const objectRef = React.createRef<MockNode>();
    const node: MockNode = { id: 'test-node' };

    objectRef.current = node;

    const merged = mergeRefs<MockNode>(functionRef, objectRef);
    merged(null);

    expect(functionRef).toHaveBeenCalledWith(null);
    expect(objectRef.current).toBeNull();
  });
});
