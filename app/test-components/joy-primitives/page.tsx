'use client'

/**
 * Joy UI Primitives Test Page
 *
 * Comprehensive testing and demonstration of all Joy UI primitive components
 * with the Supabase green theme integration.
 */

import * as React from 'react'
import {
    Button,
    Input,
    Textarea,
    Select,
    Option,
    Checkbox,
    Chip,
    Avatar,
    AvatarGroup,
    Card,
    CardContent,
    CardTitle,
    CardDescription,
    CardActions,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@/components/ui/joy'

export default function JoyPrimitivesTestPage() {
    const [inputValue, setInputValue] = React.useState('')
    const [textareaValue, setTextareaValue] = React.useState('')
    const [selectValue, setSelectValue] = React.useState<string | null>('')
    const [checked, setChecked] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleLoadingClick = () => {
        setLoading(true)
        setTimeout(() => setLoading(false), 2000)
    }

    return (
        <div className="container mx-auto p-8 space-y-12">
            <div>
                <h1 className="text-4xl font-bold mb-2">
                    Joy UI Primitives Test
                </h1>
                <p className="text-foreground/70">
                    Production-ready components with Supabase green theme
                </p>
            </div>

            {/* Button Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Buttons</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Variants</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Button variant="solid" color="primary">
                                Solid Primary
                            </Button>
                            <Button variant="soft" color="primary">
                                Soft Primary
                            </Button>
                            <Button variant="outlined" color="primary">
                                Outlined Primary
                            </Button>
                            <Button variant="plain" color="primary">
                                Plain Primary
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Colors</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Button color="primary">Primary</Button>
                            <Button color="neutral">Neutral</Button>
                            <Button color="danger">Danger</Button>
                            <Button color="success">Success</Button>
                            <Button color="warning">Warning</Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Sizes</h3>
                        <div className="flex gap-2 items-center flex-wrap">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">States</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Button disabled>Disabled</Button>
                            <Button
                                loading={loading}
                                onClick={handleLoadingClick}
                            >
                                {loading ? 'Loading...' : 'Click to Load'}
                            </Button>
                            <Button fullWidth>Full Width</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Input Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Input Fields</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <FormHelperText>
                            We'll never share your email
                        </FormHelperText>
                    </FormControl>

                    <FormControl error>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            error
                        />
                        <FormHelperText>Password is required</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Small Input</FormLabel>
                        <Input size="sm" placeholder="Small size" />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Large Input</FormLabel>
                        <Input size="lg" placeholder="Large size" />
                    </FormControl>
                </div>
            </section>

            {/* Textarea Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Textarea</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Enter your message..."
                            minRows={3}
                            maxRows={6}
                            value={textareaValue}
                            onChange={(e) => setTextareaValue(e.target.value)}
                        />
                        <FormHelperText>
                            {textareaValue.length} characters
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Auto-resizing</FormLabel>
                        <Textarea
                            placeholder="Try typing multiple lines..."
                            minRows={2}
                            maxRows={10}
                        />
                        <FormHelperText>
                            Automatically adjusts height
                        </FormHelperText>
                    </FormControl>
                </div>
            </section>

            {/* Select Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Select</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl>
                        <FormLabel>Category</FormLabel>
                        <Select
                            placeholder="Choose a category"
                            value={selectValue}
                            onChange={(_, value) => setSelectValue(value)}
                        >
                            <Option value="tech">Technology</Option>
                            <Option value="design">Design</Option>
                            <Option value="marketing">Marketing</Option>
                            <Option value="sales">Sales</Option>
                        </Select>
                        <FormHelperText>Select your department</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Priority</FormLabel>
                        <Select placeholder="Select priority" color="danger">
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                            <Option value="urgent">Urgent</Option>
                        </Select>
                    </FormControl>
                </div>
            </section>

            {/* Checkbox Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Checkbox</h2>

                <div className="space-y-2">
                    <Checkbox
                        label="Accept terms and conditions"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                    />
                    <Checkbox label="Subscribe to newsletter" />
                    <Checkbox label="Enable notifications" />
                    <Checkbox label="Disabled option" disabled />
                    <Checkbox label="Indeterminate state" indeterminate />
                </div>
            </section>

            {/* Chip/Badge Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Chips & Badges</h2>

                <div className="flex gap-2 flex-wrap">
                    <Chip variant="solid" color="primary">
                        Solid
                    </Chip>
                    <Chip variant="soft" color="success">
                        Success
                    </Chip>
                    <Chip variant="outlined" color="danger">
                        Danger
                    </Chip>
                    <Chip variant="plain" color="warning">
                        Warning
                    </Chip>
                    <Chip
                        variant="soft"
                        color="primary"
                        onDelete={() => {
                            // Handle delete
                        }}
                    >
                        Removable
                    </Chip>
                </div>
            </section>

            {/* Avatar Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Avatars</h2>

                <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                        <Avatar size="sm">SM</Avatar>
                        <Avatar size="md">MD</Avatar>
                        <Avatar size="lg">LG</Avatar>
                    </div>

                    <div className="flex gap-2">
                        <Avatar variant="solid" color="primary">
                            JD
                        </Avatar>
                        <Avatar variant="soft" color="success">
                            AB
                        </Avatar>
                        <Avatar variant="outlined" color="danger">
                            XY
                        </Avatar>
                    </div>

                    <AvatarGroup>
                        <Avatar>JD</Avatar>
                        <Avatar>AB</Avatar>
                        <Avatar>XY</Avatar>
                        <Avatar>+5</Avatar>
                    </AvatarGroup>
                </div>
            </section>

            {/* Card Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Cards</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="outlined">
                        <CardContent>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>
                                This is a card description with some text
                                content.
                            </CardDescription>
                        </CardContent>
                        <CardActions>
                            <Button variant="solid" size="sm">
                                Action
                            </Button>
                            <Button variant="outlined" size="sm">
                                Cancel
                            </Button>
                        </CardActions>
                    </Card>

                    <Card variant="soft" color="primary">
                        <CardContent>
                            <CardTitle>Soft Variant</CardTitle>
                            <CardDescription>
                                Card with soft primary color background.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card variant="solid" color="success">
                        <CardContent>
                            <CardTitle sx={{ color: 'white' }}>
                                Solid Variant
                            </CardTitle>
                            <CardDescription
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                            >
                                Card with solid success color.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Theme Integration Info */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Theme Integration</h2>
                <Card variant="outlined">
                    <CardContent>
                        <CardTitle>Supabase Green Theme</CardTitle>
                        <CardDescription>
                            All components use the Supabase green (hsl(153 60%
                            53%)) as the primary color with proper dark mode
                            support. The theme provides:
                        </CardDescription>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>4 global variants: solid, soft, outlined, plain</li>
                            <li>
                                5 color palettes: primary, neutral, danger,
                                success, warning
                            </li>
                            <li>3 sizes: sm, md, lg</li>
                            <li>
                                Custom focus ring with 3:1 contrast ratio for
                                WCAG 2.1 AA
                            </li>
                            <li>Full TypeScript support with ref forwarding</li>
                            <li>Proper ARIA attributes for accessibility</li>
                        </ul>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
