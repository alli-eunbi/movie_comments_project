import React, {useEffect} from 'react';
import { List, Avatar } from 'antd';
import axios from 'axios';


export default function InfoPages() {

  axios.get("http://localhost:5000/user-ranking")
  .then((response)=> {
    console.log(response)
      if (Object.values(response.success) === true) {
        const user_index = Object.values(response.temperature_rank.index);
        const user_name = Object.values(response.temperature_rank.name);
        const user_profile_img = Object.values(response.temperature_rank.profile_image);
        const user_temperature = Object.values(response.temperature_rank.temperature);
       console.log(user_index, user_name, user_profile_img, user_temperature);
     }
    }
  )
  .catch((error)=> {
      console.log(error)
  })

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
        <div><h2>RankPage</h2></div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.title}</a>}
              />
            </List.Item>  
          )}
        />,
      </>
  )
};
