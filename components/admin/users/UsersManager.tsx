// components/admin/users/UsersManager.tsx

'use client'

import React, { useState } from 'react'
import CreateUserModal from './CreateUserModal'
import UsersTable, { UserRow } from './UsersTable'

interface Props {
    users: UserRow[]
}

export default function UsersManager({ users }: Props) {
    const [showModal, setShowModal] = useState(false)
    const handleCreated = (newUser: UserRow) => {
        // можна оновити локальний стан або викликати router.refresh()
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Користувачі</h1>
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Створити користувача
                </button>
            </div>

            {showModal && (
                <CreateUserModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreated}
                />
            )}

            <UsersTable users={users} />
        </div>
    )
}
