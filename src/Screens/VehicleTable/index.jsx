import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, TableSortLabel, TablePagination, MenuItem, Select, Button, Checkbox,
  FormControlLabel, IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

const VehicleTable = ({ data = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('VINOneToTen');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    VIN: true, Make: true, Model: true, Year: true, Type: true, Range: true, County: true
  });

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleFilterYearChange = (e) => setFilterYear(e.target.value);
  const handleFilterTypeChange = (e) => setFilterType(e.target.value);
  const handleResetFilters = () => {
    setFilterYear('');
    setFilterType('');
    setSearchQuery('');
  };
  
  const handleToggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const filteredData = useMemo(() => {
    return data
      .filter(vehicle => (
        (!filterYear || vehicle.ModelYear === filterYear) &&
        (!filterType || vehicle.ElectricVehicleType === filterType) &&
        (Object.values(vehicle).some((val) =>
          val?.toString().toLowerCase().includes(searchQuery)
        ))
      ))
      .sort((a, b) => {
        const aMatches = Object.values(a).some((val) =>
          val?.toString().toLowerCase().includes(searchQuery)
        );
        const bMatches = Object.values(b).some((val) =>
          val?.toString().toLowerCase().includes(searchQuery)
        );
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;

        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, filterYear, filterType, searchQuery, order, orderBy]);

  const exportToCSV = () => {
    const csvData = [
      ['VIN', 'Make', 'Model', 'Year', 'Type', 'Range', 'County'],
      ...filteredData.map((vehicle) => [
        vehicle.VINOneToTen, vehicle.Make, vehicle.Model, vehicle.ModelYear,
        vehicle.ElectricVehicleType, vehicle.ElectricRange, vehicle.County
      ]),
    ];

    const csvContent = csvData
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'VehicleData.csv');
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <TextField
          label="Search VIN, Model, etc."
          variant="outlined"
          fullWidth
          sx={{
            marginBottom: 2,
            borderRadius: 2,
            boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
            '& .MuiOutlinedInput-input': { padding: '12px' },
          }}
          onChange={handleSearchChange}
        />
        <Select
          value={filterYear}
          onChange={handleFilterYearChange}
          displayEmpty
          variant="outlined"
          sx={{ ml: 2, minWidth: 120 }}
        >
          <MenuItem value="">All Years</MenuItem>
          {[...new Set(data.map(item => item.ModelYear))].map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
        <Select
          value={filterType}
          onChange={handleFilterTypeChange}
          displayEmpty
          variant="outlined"
          sx={{ ml: 2, minWidth: 120 }}
        >
          <MenuItem value="">All Types</MenuItem>
          {[...new Set(data.map(item => item.ElectricVehicleType))].map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
        <Button onClick={handleResetFilters} sx={{ ml: 2 }}>Clear Filters</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div>
          {Object.keys(visibleColumns).map((column) => (
            <FormControlLabel
              key={column}
              control={
                <Checkbox
                  checked={visibleColumns[column]}
                  onChange={() => handleToggleColumn(column)}
                />
              }
              label={column}
            />
          ))}
        </div>
        <IconButton onClick={exportToCSV}>
          <DownloadIcon />
        </IconButton>
      </div>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['VIN', 'Make', 'Model', 'Year', 'Type', 'Range', 'County'].map((header) => (
                visibleColumns[header] && (
                  <TableCell
                    key={header}
                    sx={{ fontWeight: 'bold', backgroundColor: '#f4f6f8', color: '#3f51b5' }}
                  >
                    <TableSortLabel
                      active={orderBy === header}
                      direction={orderBy === header ? order : 'asc'}
                      onClick={() => handleSort(header)}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                )
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vehicle, index) => (
              <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f4f6f8' } }}>
                {visibleColumns['VIN'] && <TableCell>{vehicle.VINOneToTen}</TableCell>}
                {visibleColumns['Make'] && <TableCell>{vehicle.Make}</TableCell>}
                {visibleColumns['Model'] && <TableCell>{vehicle.Model}</TableCell>}
                {visibleColumns['Year'] && <TableCell>{vehicle.ModelYear}</TableCell>}
                {visibleColumns['Type'] && <TableCell>{vehicle.ElectricVehicleType}</TableCell>}
                {visibleColumns['Range'] && <TableCell>{vehicle.ElectricRange}</TableCell>}
                {visibleColumns['County'] && <TableCell>{vehicle.County}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default VehicleTable;
