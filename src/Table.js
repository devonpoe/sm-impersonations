import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  TablePagination,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Modal,
  Button,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TableComp = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filterValues, setFilterValues] = useState({
    searchTerm: [],
    name: '',
    bio: '',
    url: '',
    createdAt: ''
  });
  const [filteredData, setFilteredData] = useState(data ? data : []);
  const [openModal, setOpenModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const updatedFilteredData = data.filter(item =>
      (filterValues.searchTerm.length === 0 || filterValues.searchTerm.some(term => item.searchTerm?.toLowerCase()?.includes(term.toLowerCase()))) &&
      (!filterValues.name || item.name?.toLowerCase()?.includes(filterValues.name.toLowerCase())) &&
      (!filterValues.bio || item.bio?.toLowerCase()?.includes(filterValues.bio.toLowerCase())) &&
      (!filterValues.url || item.url?.toLowerCase()?.includes(filterValues.url.toLowerCase())) &&
      (!filterValues.createdAt || item.createdAt?.toLowerCase()?.includes(filterValues.createdAt.toLowerCase()))
    );

    const sortedData = updatedFilteredData.slice().sort((a, b) => {
      if (!sortBy) return 0;

      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(sortedData);
  }, [filterValues, data, sortBy, sortOrder]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchTermChange = (event) => {
    const { value, checked } = event.target;
    let updatedSearchTerms = [...filterValues.searchTerm];
    if (checked) {
      updatedSearchTerms.push(value);
    } else {
      updatedSearchTerms = updatedSearchTerms.filter(term => term !== value);
    }
    setFilterValues(prevState => ({ ...prevState, searchTerm: updatedSearchTerms }));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRowMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortingArrow = ({ column }) => {
    return (
      <IconButton onClick={() => handleSort(column)}>
        {sortBy === column && sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </IconButton>
    );
  };

  return (
    <div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button onClick={handleOpenModal}>Search Term</Button>
                <Modal open={openModal} onClose={handleCloseModal}>
                  <Paper>
                    <FormLabel>Select Search Terms</FormLabel>
                    <FormGroup>
                      {Array.from(new Set(data.map(item => item.searchTerm)))
                        .filter(term => term)
                        .map((term, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={filterValues.searchTerm.includes(term)}
                                onChange={handleSearchTermChange}
                                value={term}
                              />
                            }
                            label={term}
                          />
                        ))}
                    </FormGroup>
                    <Button onClick={handleCloseModal}>Close</Button>
                  </Paper>
                </Modal>
                <SortingArrow column="searchTerm" />
              </TableCell>
              <TableCell>
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  value={filterValues.name}
                  onChange={(e) => setFilterValues({ ...filterValues, name: e.target.value })}
                />
                <SortingArrow column="name" />
              </TableCell>
              <TableCell>
                <TextField
                  label="Bio"
                  variant="outlined"
                  size="small"
                  value={filterValues.bio}
                  onChange={(e) => setFilterValues({ ...filterValues, bio: e.target.value })}
                />
                <SortingArrow column="bio" />
              </TableCell>
              <TableCell>
                <TextField
                  label="URL"
                  variant="outlined"
                  size="small"
                  value={filterValues.url}
                  onChange={(e) => setFilterValues({ ...filterValues, url: e.target.value })}
                />
                <SortingArrow column="url" />
              </TableCell>
              <TableCell>
                <TextField
                  label="Found"
                  variant="outlined"
                  size="small"
                  value={filterValues.createdAt}
                  onChange={(e) => setFilterValues({ ...filterValues, createdAt: e.target.value })}
                />
                <SortingArrow column="createdAt" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredData
            ).map((item, index) => (
              <TableRow
                key={item.url}
                onMouseEnter={() => handleRowMouseEnter(index)}
                onMouseLeave={handleRowMouseLeave}
                className={hoveredRow === index ? 'hovered' : ''}
              >
                <TableCell>{item.searchTerm}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.bio && item.bio.length > 40 ? item.bio.substring(0, 40) + '...' : item.bio}</TableCell>
                <TableCell>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url.length > 40 ? item.url.substring(0, 40) + '...' : item.url}
                  </a>
                </TableCell>
                <TableCell>{item.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableComp;
