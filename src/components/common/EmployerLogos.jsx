import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  textAlign: 'center',
}));

const LogosContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  marginTop: theme.spacing(3),
  '& img': {
    height: '40px',
    width: 'auto',
    maxWidth: '150px',
    objectFit: 'contain',
    filter: 'grayscale(100%)',
    opacity: 0.7,
    transition: 'all 0.3s ease',
    '&:hover': {
      filter: 'grayscale(0%)',
      opacity: 1,
    },
  },
}));

const EmployerLogos = ({ title = "Trusted by leading companies", companies = [] }) => {
  // Default company logos (can be replaced with actual company logos)
  const defaultCompanies = [
    { name: 'Company 1', logo: 'https://via.placeholder.com/150x60?text=Company+1' },
    { name: 'Company 2', logo: 'https://via.placeholder.com/150x60?text=Company+2' },
    { name: 'Company 3', logo: 'https://via.placeholder.com/150x60?text=Company+3' },
    { name: 'Company 4', logo: 'https://via.placeholder.com/150x60?text=Company+4' },
  ];

  const companyList = companies.length > 0 ? companies : defaultCompanies;

  return (
    <StyledContainer maxWidth="lg">
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      <LogosContainer>
        {companyList.map((company, index) => (
          <img
            key={index}
            src={company.logo}
            alt={company.name}
            loading="lazy"
          />
        ))}
      </LogosContainer>
    </StyledContainer>
  );
};

export default EmployerLogos;
