import React from 'react';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';

export const columnsEmployee = [
  { title: 'Mã', field: 'code', editable: 'never' },
  { title: 'Họ và tên', field: 'name' },
  {
    title: 'Ngày sinh',
    field: 'birthday',
    type: 'date'
  },
  {
    title: 'Địa chỉ',
    field: 'address'
  },
  { title: 'Số điện thoại', field: 'phoneNumber' },
  { title: 'Phòng ban', field: 'department' },
  {
    title: 'Trạng thái',
    field: 'status',
    lookup: {
      0: <LockIcon />,
      1: <LockOpenIcon />
    }
  }
];

export const localization = {
  header: {
    actions: 'Thao tác'
  },
  pagination: {
    labelDisplayedRows: '{from}-{to} của {count}',
    labelRowsPerPage: 'Dòng/trang:',
    labelRowsSelect: 'dòng',
    firstTooltip: 'Trang đầu',
    previousTooltip: 'Trang trước',
    nextTooltip: 'Trang kế',
    lastTooltip: 'Trang cuối'
  },
  body: {
    emptyDataSourceMessage: 'Không có dữ liệu',
    filterRow: {},
    editRow: {
      saveTooltip: 'Lưu',
      cancelTooltip: 'Huỷ',
      deleteText: 'Bạn chắc chắn muốn xoá dòng này ?'
    },
    addTooltip: 'Thêm mới',
    deleteTooltip: 'Xoá',
    editTooltip: 'Chỉnh sửa'
  },
  toolbar: {
    searchTooltip: 'Tìm kiếm',
    searchPlaceholder: 'Tìm kiếm'
  }
};

export const options = {
  actionsColumnIndex: -1,
  addRowPosition: 'first',
  headerStyle: {
    fontWeight: 'bold'
  },
  paginationType: 'stepped',
  pageSize: 8,
  pageSizeOptions: [5, 8]
};

export const icons = {
  Add: forwardRef((props, ref) => (
    <AddBox className="text-primary" {...props} ref={ref} />
  )),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <LockOpenIcon {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => (
    <Edit className="text-info" {...props} ref={ref} />
  )),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
