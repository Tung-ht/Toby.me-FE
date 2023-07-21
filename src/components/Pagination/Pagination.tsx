import { range } from 'ramda';
import { styled } from 'styled-components';

export function Pagination({
  currentPage,
  count,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  count: number;
  itemsPerPage: number;
  onPageChange?: (index: number) => void;
}) {
  return (
    <PaginationStyled>
      <ul className='pagination'>
        {Math.ceil(count / itemsPerPage) > 1 &&
          range(1, Math.ceil(count / itemsPerPage) + 1).map((index) => (
            <li
              key={index}
              className={`page-item${currentPage !== index ? '' : ' active'}`}
              onClick={onPageChange && (() => onPageChange(index))}
            >
              <span
                style={{ cursor: 'pointer' }}
                className='page-link'
                aria-label={`Go to page number ${index}`}
              >
                {index}
              </span>
            </li>
          ))}
      </ul>
    </PaginationStyled>
  );
}

const PaginationStyled = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
`;
