import { Box, Typography, Table } from '@/components/ui/joy'
import { CheckCircle, Cancel } from '@mui/icons-material'

const comparisonData = [
    {
        feature: 'Documents',
        free: '1,000',
        pro: '50,000',
        enterprise: 'Unlimited',
    },
    {
        feature: 'API Requests',
        free: '100/day',
        pro: '10,000/day',
        enterprise: 'Unlimited',
    },
    { feature: 'Users', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    {
        feature: 'AI Agents',
        free: 'Basic',
        pro: '16+ Advanced',
        enterprise: 'Custom + Development',
    },
    {
        feature: 'Support',
        free: 'Community',
        pro: 'Priority Email',
        enterprise: '24/7 Phone & Email',
    },
    {
        feature: 'Security',
        free: 'Standard',
        pro: 'Enterprise',
        enterprise: 'Bank-grade + Compliance',
    },
    {
        feature: 'Analytics',
        free: 'Basic',
        pro: 'Advanced',
        enterprise: 'Real-time Dashboard',
    },
    {
        feature: 'Integrations',
        free: 'None',
        pro: 'Custom',
        enterprise: 'White-label',
    },
    { feature: 'SLA', free: 'None', pro: '99.5%', enterprise: '99.9%' },
    { feature: 'On-premise', free: false, pro: false, enterprise: true },
]

export function PricingComparison() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 4 } }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        level="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            mb: 3,
                        }}
                    >
                        Compare Plans
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '1.125rem',
                            maxWidth: 600,
                            mx: 'auto',
                        }}
                    >
                        Detailed comparison of all features and capabilities
                        across our pricing tiers.
                    </Typography>
                </Box>

                <Box sx={{ overflow: 'auto' }}>
                    <Table
                        variant="outlined"
                        sx={{
                            borderRadius: 'xl',
                            minWidth: 800,
                            '& thead th': {
                                bgcolor: 'background.level1',
                                fontWeight: 700,
                                fontSize: 'sm',
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                py: 3,
                                textAlign: 'center',
                                '&:first-of-type': { textAlign: 'left' },
                            },
                            '& tbody td': {
                                py: 3,
                                verticalAlign: 'top',
                                textAlign: 'center',
                                '&:first-of-type': {
                                    fontWeight: 600,
                                    textAlign: 'left',
                                },
                            },
                        }}
                    >
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Free</th>
                                <th>Pro</th>
                                <th>Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.feature}</td>
                                    <td>
                                        {typeof row.free === 'boolean' ? (
                                            row.free ? (
                                                <CheckCircle
                                                    sx={{
                                                        color: 'success.500',
                                                    }}
                                                />
                                            ) : (
                                                <Cancel
                                                    sx={{ color: 'danger.500' }}
                                                />
                                            )
                                        ) : (
                                            <Typography level="body-sm">
                                                {row.free}
                                            </Typography>
                                        )}
                                    </td>
                                    <td>
                                        {typeof row.pro === 'boolean' ? (
                                            row.pro ? (
                                                <CheckCircle
                                                    sx={{
                                                        color: 'success.500',
                                                    }}
                                                />
                                            ) : (
                                                <Cancel
                                                    sx={{ color: 'danger.500' }}
                                                />
                                            )
                                        ) : (
                                            <Typography level="body-sm">
                                                {row.pro}
                                            </Typography>
                                        )}
                                    </td>
                                    <td>
                                        {typeof row.enterprise === 'boolean' ? (
                                            row.enterprise ? (
                                                <CheckCircle
                                                    sx={{
                                                        color: 'success.500',
                                                    }}
                                                />
                                            ) : (
                                                <Cancel
                                                    sx={{ color: 'danger.500' }}
                                                />
                                            )
                                        ) : (
                                            <Typography level="body-sm">
                                                {row.enterprise}
                                            </Typography>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Box>
            </Box>
        </Box>
    )
}
