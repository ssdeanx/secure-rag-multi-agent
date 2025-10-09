'use client';

import { Box, Button, Typography } from '@/components/ui/joy';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (_: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const visiblePages = pages.filter((page) => {
        if (page === 1 || page === totalPages) {return true;}
        if (page >= currentPage - 1 && page <= currentPage + 1) {return true;}
        return false;
    });

    return (
        <Box
            component="nav"
            aria-label="Pagination"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                mt: 8,
            }}
        >
            <Button
                variant="outlined"
                color="neutral"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                startDecorator={<ChevronLeft />}
                sx={{ minWidth: 100 }}
            >
                Previous
            </Button>

            <Box sx={{ display: 'flex', gap: 1, mx: 2 }}>
                {visiblePages.map((page, index) => {
                    const prevPage = visiblePages[index - 1];
                    const showEllipsis = prevPage !== undefined && page - prevPage > 1;

                    return (
                        <Box key={page} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {showEllipsis && (
                                <Typography level="body-md" sx={{ px: 1, color: 'text.secondary' }}>
                                    ...
                                </Typography>
                            )}
                            <Button
                                variant={page === currentPage ? 'solid' : 'outlined'}
                                color={page === currentPage ? 'primary' : 'neutral'}
                                onClick={() => onPageChange(page)}
                                sx={{
                                    minWidth: 40,
                                    px: 2,
                                }}
                            >
                                {page}
                            </Button>
                        </Box>
                    );
                })}
            </Box>

            <Button
                variant="outlined"
                color="neutral"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                endDecorator={<ChevronRight />}
                sx={{ minWidth: 100 }}
            >
                Next
            </Button>
        </Box>
    );
}
