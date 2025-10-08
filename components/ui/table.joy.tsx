'use client'

import * as React from 'react'
import { Table as JoyTable, Sheet } from '@mui/joy'
import type { SxProps } from '@mui/system'

export interface TableProps {
  children: React.ReactNode
  variant?: 'plain' | 'outlined' | 'soft' | 'solid'
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  stripe?: 'odd' | 'even'
  hoverRow?: boolean
  borderAxis?: 'none' | 'x' | 'y' | 'both' | 'xBetween' | 'yBetween' | 'bothBetween'
  stickyHeader?: boolean
  stickyFooter?: boolean
  noWrap?: boolean
  sx?: SxProps
  className?: string
}

export interface TableContainerProps {
  children: React.ReactNode
  sx?: SxProps
  className?: string
}

export const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  ({ children, sx, className, ...props }, ref) => {
    return (
      <Sheet
        ref={ref}
        variant="outlined"
        sx={{ overflow: 'auto', ...sx }}
        className={className}
        {...props}
      >
        {children}
      </Sheet>
    )
  }
)
TableContainer.displayName = 'TableContainer'

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, variant, color, size = 'md', stripe, hoverRow, borderAxis = 'xBetween', stickyHeader, stickyFooter, noWrap, sx, className, ...props }, ref) => {
    return (
      <JoyTable
        ref={ref}
        variant={variant}
        color={color}
        size={size}
        stripe={stripe}
        hoverRow={hoverRow}
        borderAxis={borderAxis}
        stickyHeader={stickyHeader}
        stickyFooter={stickyFooter}
        noWrap={noWrap}
        sx={sx}
        className={className}
        {...props}
      >
        {children}
      </JoyTable>
    )
  }
)
Table.displayName = 'Table'

export const TableHead = React.forwardRef<HTMLTableSectionElement, { children: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <thead ref={ref} className={className} {...props}>
        {children}
      </thead>
    )
  }
)
TableHead.displayName = 'TableHead'

export const TableBody = React.forwardRef<HTMLTableSectionElement, { children: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    )
  }
)
TableBody.displayName = 'TableBody'

export const TableFooter = React.forwardRef<HTMLTableSectionElement, { children: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <tfoot ref={ref} className={className} {...props}>
        {children}
      </tfoot>
    )
  }
)
TableFooter.displayName = 'TableFooter'

export const TableRow = React.forwardRef<HTMLTableRowElement, { children: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <tr ref={ref} className={className} {...props}>
        {children}
      </tr>
    )
  }
)
TableRow.displayName = 'TableRow'

export const TableCell = React.forwardRef<HTMLTableCellElement, { children?: React.ReactNode; className?: string; colSpan?: number; rowSpan?: number }>(
  ({ children, className, ...props }, ref) => {
    return (
      <td ref={ref} className={className} {...props}>
        {children}
      </td>
    )
  }
)
TableCell.displayName = 'TableCell'

export const TableHeader = React.forwardRef<HTMLTableCellElement, { children?: React.ReactNode; className?: string; colSpan?: number; rowSpan?: number }>(
  ({ children, className, ...props }, ref) => {
    return (
      <th ref={ref} className={className} {...props}>
        {children}
      </th>
    )
  }
)
TableHeader.displayName = 'TableHeader'

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, { children: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    return (
      <caption ref={ref} className={className} {...props}>
        {children}
      </caption>
    )
  }
)
TableCaption.displayName = 'TableCaption'
