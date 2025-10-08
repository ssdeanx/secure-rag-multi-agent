'use client';

import React from 'react';
import {
    MenuButton,
    Menu,
    MenuItem,
    ListItemDecorator,
    Avatar,
    Typography,
    Box,
    Dropdown,
} from '@/components/ui/joy';
import { Logout } from '@mui/icons-material';

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
}

export function UserMenu({ user }: UserMenuProps) {
    const handleLogout = () => {
        // TODO: Implement logout logic (e.g., call an action or API)
    };

    return (
        <Box>
            <Dropdown>
                <MenuButton sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={user.avatar} alt={user.name} size="sm" />
                    <Typography level="body-sm">{user.name}</Typography>
                </MenuButton>

                <Menu>
                    <MenuItem>
                        <ListItemDecorator>
                            <Avatar src={user.avatar} alt={user.name} size="sm" />
                        </ListItemDecorator>
                        <Box>
                            <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                {user.name}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                {user.email}
                            </Typography>
                        </Box>
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                        <ListItemDecorator>
                            <Logout />
                        </ListItemDecorator>
                        Logout
                    </MenuItem>
                </Menu>
            </Dropdown>
        </Box>
    );
}
