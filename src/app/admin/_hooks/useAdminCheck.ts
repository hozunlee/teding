"use client";

import { useEffect, useState } from "react";

export function useAdminCheck() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        fetch("/api/admin/check")
            .then((r) => r.json())
            .then((d: { isAdmin: boolean }) => setIsAdmin(d.isAdmin))
            .catch(() => setIsAdmin(false));
    }, []);

    return { isAdmin };
}
