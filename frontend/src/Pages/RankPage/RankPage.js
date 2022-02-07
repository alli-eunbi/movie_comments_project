import React from 'react';
import { List, Avatar } from 'antd';

export default function InfoPages() {
  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 5',
    },
    {
      title: 'Ant Design Title 6',
    },
    {
      title: 'Ant Design Title 7',
    },
    {
      title: 'Ant Design Title 8',
    },
    {
      title: 'Ant Design Title 9',
    },
    {
      title: 'Ant Design Title 10',
    }
  ];

  return (
      <>
        <div><h2>회원가입</h2></div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>  
          )}
        />,
      </>
  )
};
