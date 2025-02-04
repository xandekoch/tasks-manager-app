import React from 'react'
import { Skeleton } from '../ui/skeleton'

const TableSkeleton = () => {
    return (
        <>
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
            <div className="flex flex-col mt-2">
                <Skeleton className="h-10 w-80 self-end" />
            </div>
        </>
    )
}

export default TableSkeleton