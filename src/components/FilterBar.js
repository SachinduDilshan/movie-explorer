import { Box, Button, MenuItem, TextField } from '@mui/material';

const thisYear = new Date().getFullYear();
const years = Array.from({ length: thisYear - 1969 }, (_, i) => thisYear - i);
const ratings = [5, 6, 7, 8];

// keeps the label above the field even when nothing is picked
const selectProps = { select: { displayEmpty: true }, inputLabel: { shrink: true } };

export default function FilterBar({ filters, genres, onChange, onReset }) {
  const active = Object.values(filters).some(Boolean);
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        alignItems: 'center',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, minmax(0, 200px)) auto' },
      }}
    >
      <TextField
        select
        size="small"
        label="Genre"
        value={filters.genre}
        onChange={update('genre')}
        slotProps={selectProps}
        sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
      >
        <MenuItem value="">All genres</MenuItem>
        {genres.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Year"
        value={filters.year}
        onChange={update('year')}
        slotProps={selectProps}
      >
        <MenuItem value="">Any year</MenuItem>
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Rating"
        value={filters.rating}
        onChange={update('rating')}
        slotProps={selectProps}
      >
        <MenuItem value="">Any rating</MenuItem>
        {ratings.map((r) => (
          <MenuItem key={r} value={r}>
            {r}+
          </MenuItem>
        ))}
      </TextField>

      {active && (
        <Button onClick={onReset} sx={{ justifySelf: 'start' }}>
          Reset filters
        </Button>
      )}
    </Box>
  );
}