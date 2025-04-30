import { ChevronDown} from "lucide-react"
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {Sidebar,SidebarMenu,SidebarMenuButton,SidebarMenuItem,SidebarMenuSub,SidebarMenuSubItem,} from "@/components/ui/sidebar"
import Link from "next/link";
import type { Venue } from '@/types/venue';

type AppSidebarProps = {
    venues: Venue[];
};

export default function AppSidebar({ venues }: AppSidebarProps) {
    return (
        <Sidebar className='mt-3' >
            <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem className="w-[--radix-popper-anchor-width]">
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                Danh sách sân
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {venues.length > 0 ? (
                                    venues.map((venue) => (
                                        <Link href={`/venue/${venue.venue_id}`} className="block w-full">
                                            {venue.name}
                                        </Link>
                                    ))
                                ) : (
                                    <SidebarMenuSubItem>
                                        Không có sân nào.
                                    </SidebarMenuSubItem>
                                )}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </Sidebar>
    );
}

