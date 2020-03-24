import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';

import { User } from '.';

interface ModalProps {
  type: 'resource' | 'level' | 'ship';
  data?: User;
  setModalInfo: (data: any) => void;
}

const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }

  input {
    flex-basis: 40%;
  }
`;

function ModalContent(props: ModalProps) {
  const { data, type, setModalInfo } = props;
  const resourceName = ['油', '弹', '钢', '铝'];
  return type === 'level' ? (
    <div>
      <span>等级</span>
      <Input
        placeholder="等级"
        value={data?.level}
        onChange={(e) =>
          setModalInfo({
            type,
            data: {
              ...data,
              level: +e.target.value,
            },
          })
        }
      />
    </div>
  ) : (
    <div>
      {resourceName.map((name, index) => (
        <InputWrapper key={name}>
          <span>{name}</span>
          <Input
            placeholder={name}
            value={data?.resource[index]}
            onChange={(e) =>
              setModalInfo({
                type,
                data: {
                  ...data,
                  resource: data?.resource.map((r, i) => (i === index ? +e.target.value : r)),
                },
              })
            }
          />
        </InputWrapper>
      ))}
    </div>
  );
}

export default ModalContent;
