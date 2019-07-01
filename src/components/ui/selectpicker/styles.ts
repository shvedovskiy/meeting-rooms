import { CSSProperties } from 'react';

export const customStyles = {
  control: (provided: CSSProperties, state: any) => ({
    ...provided,
    height: state.selectProps.size === 'default' ? '38px' : '44px',
    padding: '0 6px 0 8px',
    fontSize:
      state.selectProps.size === 'default'
        ? 'var(--default-text)'
        : 'var(--medium-text)',
    border: `2px solid var(${state.isFocused ? '--border-1' : '--border'})`,
    boxShadow: 'none',
    transition: 'none',
    cursor: 'text',
    '&:hover': {
      border: `2px solid var(${state.isFocused ? '--border-1' : '--border'})`,
    },
  }),
  input: () => ({
    color: 'var(--text-primary)',
  }),
  placeholder: (provided: CSSProperties, state: any) => ({
    ...provided,
    fontSize:
      state.selectProps.size === 'default'
        ? 'var(--default-text)'
        : 'var(--medium-text)',
    fontWeight: 100,
    color: 'var(--text-secondary)',
  }),
  dropdownIndicator: (provided: CSSProperties, state: any) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
    padding: '8px 0',
    cursor: 'pointer',
    color: state.isFocused ? 'var(--text-primary)' : '#afb4b8',
    ':hover': {
      color: state.isFocused ? 'var(--text-primary)' : '#afb4b8',
    },
  }),
  menu: (provided: CSSProperties) => ({
    ...provided,
    margin: 0,
    boxShadow: '0 1px 10px var(--shadow-color)',
  }),
  menuList: (provided: CSSProperties) => ({
    ...provided,
    borderRadius: '4px',
  }),
  option: (provided: CSSProperties, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'var(--bg-secondary)' : '',
    ':active': {
      backgroundColor: 'var(--bg-secondary)',
    },
  }),
  multiValue: () => ({
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    maxWidth: '100%',
    marginRight: '8px',
    marginBottom: '8px',
    paddingRight: '8px',
    backgroundColor: 'var(--secondary-1)',
    borderRadius: '12px',
  }),
  multiValueLabel: () => ({}),
  multiValueRemove: () => ({}),
};
