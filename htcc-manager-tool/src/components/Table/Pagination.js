import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { getNumberOfPages } from '../../utils/pagination';
import PropTypes from 'prop-types';

function TablePaginationActions({ count, page, rowsPerPage, onChangePage }) {
  const handleFirstPageButtonClick = () => {
    onChangePage(1);
  };

  const handleBackButtonClick = () => {
    onChangePage(page);
  };

  const handleNextButtonClick = () => {
    onChangePage(page + 2);
  };

  const handleLastPageButtonClick = () => {
    onChangePage(getNumberOfPages(count, rowsPerPage));
  };

  return (
    <>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= getNumberOfPages(count, rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= getNumberOfPages(count, rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

const Pagination = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage
}) => (
  <TablePagination
    component="nav"
    count={rowCount}
    rowsPerPage={7}
    page={currentPage - 1}
    onChangePage={onChangePage}
    onChangeRowsPerPage={({ target }) =>
      onChangeRowsPerPage(Number(target.value))
    }
    ActionsComponent={TablePaginationActions}
  />
);

Pagination.propTypes = {
  rowsPerPage: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default Pagination;
