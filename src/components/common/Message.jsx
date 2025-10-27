import React from 'react';
import { message } from 'antd';

const MessageContext = React.createContext();

export const MessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (type, content, duration = 3) => {
    messageApi[type]({ content, duration });
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = React.useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export default MessageContext;