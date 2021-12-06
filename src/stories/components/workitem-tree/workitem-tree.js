import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Container, Grid, Button, List, Form } from 'semantic-ui-react';

import './workitem-tree.less';

export const WorkItemTree = () => {
  const [data, setData] = useState([])
  const [parentIdTracker, setParentIdTracker] = useState(1);

  // function onAddItem() {
  //   setData([...data, { title: 'you'}]);
  // }

  /**
   * Data Structure
   * [
   *    {
   *      id: "1",
   *      title: "Parent 1"
   *      children: [
   *        {
   *          id: "1.1",
   *          title: "Child 1.1"
   *        },
   *        {
   *          id: "1.2",
   *          title: "Child 1.2"
   *        }
   *      ]
   *    },
   *    {
   *      id: "2",
   *      title: "Parent 2",
   *      children: [
   *        {
   *          id: "2.1",
   *          title: "Child 2.1"
   *        },
   *        {
   *          id: "2.2",
   *          title: "Child 2.2",
   *          children: [
   *            {
   *              id: "2.2.1",
   *              title: "Child 2.2.1"
   *            }
   *          ]
   *        }
   *      ]
   *    }
   * ]
   */
  // function initialiseData(nodes) {

  // }

  function addWorkItem() {
    const id = parentIdTracker;
    const newRootItem = {
      id,
      title: '',
      children: []
    };
    setData([...data, newRootItem]);
    setParentIdTracker(parentIdTracker + 1);

    console.log(`addWorkItem ID ${id}`, newRootItem);
  }

  function addChild(id) {
    const _data = data.slice(); // create a copy

    console.log('addChild:id', id);
    const nodeTreeIds = (typeof id === 'number') ? [id] : id.split('.').map(id => parseInt(id));

    console.log('nodeTreeIds:', nodeTreeIds, 'nodeTreeIds[0]', nodeTreeIds[0]);

    // 1 level
    if (nodeTreeIds.length === 1) {

      _data.forEach((item, idx) => {
        if (item.id !== id) return;   // ID need to exist
        if (!_data[idx - 1]) return;  // no possible parent

        const parentId = _data[idx - 1].id;
        console.log(`parentId: ${parentId}`);

        const nodeToChange = _data[idx - 1];
        console.log(`nodeToChange`, nodeToChange);

        console.log('New child', item);
        const childId = `${parentId}.${nodeToChange.children.length + 1}`;
        item.id = childId;

        nodeToChange.children = [
          ...nodeToChange.children,
          item
        ];

        _data.splice(idx, 1); // drop this node

      });

      setData(_data);
    }

  }

  // function removeNode(nodeId) {
  //   return () => console.log('removeNode:nodeId', nodeId);
  // }

  function updateText(title, id) {
    setData(data.map(item =>
      item.id === id
      ? {...item, title }
      : item
    ));
  }

  // const onClick = () => {
  //   onAddItem();
  // };

  const onChange = (event, params) => {
    updateText(event.target.value, params.id);
  };

  const onKeyDown = (event, params) => {

    // enter
    if (event.keyCode === 13) {
      // updateText(event.target.value, params.id);
      // @todo add or goto next item
    }

    // tab
    if (event.keyCode === 9) {
      event.preventDefault();
      addChild(params.id);
    }
  };

  const renderChildren = (children) => (
    <List.List>
      {
        children.map((item, idx) =>(
          <renderWorkItemTree {...item} />
        ))
      }
    </List.List>
  );

  const renderWorkItemTree = (workItems) => (
    <List bulleted>
      {
        workItems.map((workItem, idx) => {
          const hasChildren = workItem.children >= 1;
          return (
            <List.Item>
              { workItem.title }
              { hasChildren && renderChildren(workItem.children)}
            </List.Item>
          )
          }
        )
      }
    </List>
  )

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Button icon='plus' content='Add' onClick={addWorkItem}/>
        </Grid.Row>
        <Grid.Row>
          <Form>
          <List bulleted>
            { console.log('[data]', data) }
            {
              data.map((item,idx) =>(
                <List.Item key={item.id}>
                  <Form.Input
                    key={idx}
                    className='workItem'
                    value={item.title}
                    onKeyDown={(event) => onKeyDown(event, {id: item.id})}
                    onChange={(event) => onChange(event, {id: item.id, idx})}
                  />
                  {
                    item.children.length >= 1 && (
                      <List.List>
                        {
                          item.children.map((childItem, childIdx) => (
                            <List.Item key={childItem.id}>
                              <Form.Input
                                key={{childIdx}}
                                className='workItem'
                                value={childItem.title}
                                onChange={(event) => onChange(event, {id: childItem.id, idx})}
                              />
                            </List.Item>
                          ))
                        }
                      </List.List>
                    )
                  }
                </List.Item>
              ))
            }
          </List>
          </Form>
        </Grid.Row>
      </Grid>
    </Container>
  )
};

WorkItemTree.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.array
};
