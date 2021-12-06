import React, { useState } from "react";
import { Button, Image, Input, Table } from "semantic-ui-react";

export const MyProfile = (props) => {
  const [avatar, setAvatar] = useState(props.avatar);
  return (
    <>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              <h2>My Profile</h2>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>UserName:</Table.Cell>
            <Table.Cell>
              <Input value={props.userName} />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>FirstName:</Table.Cell>
            <Table.Cell>
              <Input value={props.firstName} />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>LastName:</Table.Cell>
            <Table.Cell>
              <Input value={props.lastName} />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Location:</Table.Cell>
            <Table.Cell>
              <Input value={props.location} />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <Image src={avatar} avatar />
            </Table.Cell>
            <Table.Cell>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.target.files && event.target.files[0])
                    setAvatar(URL.createObjectURL(event.target.files[0]));
                }}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <div>
        <Button>SAVE</Button>
        <Button>Log out</Button>
      </div>
    </>
  );
};
