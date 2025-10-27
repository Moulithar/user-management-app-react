import React from "react";

export function getTableComponents({ isMobile }) {
  return {
    header: {
      cell: (props) => (
        <th
          {...props}
          style={{
            ...props.style,
            borderRight: "none",
            position: "relative",
            padding: isMobile ? '4px' : '16px 16px',
          }}
        >
          {props.children}
          <style jsx>{`
            :not(:last-child)::before {
              display: none !important;
            }
          `}</style>
        </th>
        
      ),
    },
    body: {
      cell: (props) => (
        <td
          {...props}
          style={{
            ...props.style,
            padding: isMobile ? '4px' : '16px 16px',
          }}
        >
          {props.children}
        </td>
      ),
    },
  };
}
