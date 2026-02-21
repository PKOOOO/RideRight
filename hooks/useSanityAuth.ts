"use client";

import { useEffect, useState } from "react";
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";

interface SanityUser {
    id: string;
    name: string;
    email: string;
}

interface ProjectMember {
    id: string;
    role: string;
}

/**
 * Hook that checks if the current user is authenticated with Sanity
 * AND is an authorized member of this specific project.
 *
 * Two checks:
 * 1. /users/me — is the user logged into Sanity at all?
 * 2. /projects/{projectId} — is the user a member of THIS project?
 */
export function useSanityAuth() {
    const [user, setUser] = useState<SanityUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const client = createClient({
            projectId,
            dataset,
            apiVersion,
            useCdn: false,
            withCredentials: true,
        });

        async function checkAuth() {
            try {
                const sanityUser = await client.request<SanityUser>({ uri: "/users/me" });
                if (!sanityUser?.id) {
                    setUser(null);
                    return;
                }

                const project = await client.request<{ members: ProjectMember[] }>({
                    uri: `/projects/${projectId}`,
                });

                const isMember = project?.members?.some(
                    (member) => member.id === sanityUser.id
                );

                if (isMember) {
                    setUser(sanityUser);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    return { user, loading, isAuthenticated: !!user };
}
