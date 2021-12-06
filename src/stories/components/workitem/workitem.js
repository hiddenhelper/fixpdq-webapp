import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Container, Table, Grid, Icon, Button, List } from 'semantic-ui-react';

export const WorkItem = ({onClick, workItems, btnLabel, btnIcon, taskListLabel, btnType, data}) => {
  const [dynamicList, setDynamicList] = useState([]);

  if (!workItems.length) {
    workItems = dynamicList;
  }

  return (
  <Container>
    <Grid celled>
      <Grid.Row>
        <Grid.Column floated='left' width={5}>
          {/*<Button basic labelPosition='left' icon='left chevron' content='Back' />*/}
        </Grid.Column>
        <Grid.Column floated='right' width={5}>
          <Button className={btnType} labelPosition='right' icon={btnIcon} content={btnLabel} onClick={() => {setDynamicList([...dynamicList, data])}}/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column stretched>
          <Table padded>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{taskListLabel}</Table.HeaderCell>
                <Table.HeaderCell>STATE</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { workItems.length > 0 && (
                <>
                  { workItems.map(item => (
                    <Table.Row>
                      <Table.Cell>
                        { item.subItems && (<Icon name='sort down'/>)}
                        { !item.subItems && (<Icon name='circle'/>)}
                        {item.title}
                        { item.subItems &&
                        item.subItems.map(subItem => (<List as='ul'><List.Item as='li'>{subItem.title}</List.Item></List>))
                        }
                      </Table.Cell>
                      <Table.Cell verticalAlign='top'>
                        <Button className={item.stateColor} content={item.stateLabel}/>
                      </Table.Cell>
                    </Table.Row>
                    )
                  )}
                </>
                )
              }
              {
                !workItems.length && (
                  <Table.Row>
                    <Table.Cell textAlign='center'>
                      You empty work items
                    </Table.Cell>
                  </Table.Row>
                )
              }
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
)};

WorkItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  workItems: PropTypes.array.isRequired,
  btnLabel: PropTypes.string.isRequired,
  btnIcon: PropTypes.string.isRequired,
  btnType: PropTypes.string.isRequired,
  taskListLabel: PropTypes.string.isRequired,
  data: PropTypes.object
};

WorkItem.defaultProps = {
  workItems: [],
  btnLabel: 'New Task',
  btnIcon: 'plus',
  taskListLabel: 'TASK NAME',
  btnType: 'basic',
  data: {}
}
