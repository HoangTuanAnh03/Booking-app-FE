import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import FieldTypeFilter from "@/components/field-type-filter"
import SearchBar from "@/components/ui/home/search-bar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-4 py-6">
        <section className="py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Đặt sân thể thao dễ dàng
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tìm và đặt sân thể thao gần bạn chỉ với vài bước đơn giản
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <SearchBar />
          </div>

          <div className="mb-12">{/* <FieldTypeFilter /> */}</div>
        </section>

        <section className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Bản đồ nổi bật</h2>
            <Link href="/fields" className="text-primary hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFields.map((field) => (
              <Link href={`/fields/${field.id}`} key={field.id}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={field.image || "/placeholder.svg"}
                      alt={field.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{field.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{field.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{field.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{field.openHours}</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="font-medium">
                        {field.price}{" "}
                        <span className="text-muted-foreground text-sm">
                          / giờ
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-1" /> Đặt ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Khám phá theo loại bản đồ</h2>
          </div>

          <Tabs defaultValue="football" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="football">Bóng đá</TabsTrigger>
              <TabsTrigger value="basketball">Bóng rổ</TabsTrigger>
              <TabsTrigger value="tennis">Tennis</TabsTrigger>
              <TabsTrigger value="badminton">Cầu lông</TabsTrigger>
            </TabsList>

            <TabsContent
              value="football"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {footballFields.map((field) => (
                <Link href={`/fields/${field.id}`} key={field.id}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={field.image || "/placeholder.svg"}
                        alt={field.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{field.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{field.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{field.location}</span>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="font-medium">
                          {field.price}{" "}
                          <span className="text-muted-foreground text-sm">
                            / giờ
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="h-4 w-4 mr-1" /> Đặt ngay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </TabsContent>

            <TabsContent value="basketball">
              <div className="text-center py-12 text-muted-foreground">
                Đang tải dữ liệu sân bóng rổ...
              </div>
            </TabsContent>

            <TabsContent value="tennis">
              <div className="text-center py-12 text-muted-foreground">
                Đang tải dữ liệu sân tennis...
              </div>
            </TabsContent>

            <TabsContent value="badminton">
              <div className="text-center py-12 text-muted-foreground">
                Đang tải dữ liệu sân cầu lông...
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Mock data
const featuredFields = [
  {
    id: "1",
    name: "Sân bóng đá Mini Thống Nhất",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.8,
    location: "Quận 1, TP.HCM",
    openHours: "06:00 - 22:00",
    price: "300.000đ",
  },
  {
    id: "2",
    name: "Sân Tennis Phú Nhuận",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.6,
    location: "Quận Phú Nhuận, TP.HCM",
    openHours: "05:30 - 21:00",
    price: "250.000đ",
  },
  {
    id: "3",
    name: "Sân Cầu Lông Tân Bình",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.5,
    location: "Quận Tân Bình, TP.HCM",
    openHours: "06:00 - 22:00",
    price: "150.000đ",
  },
];

const footballFields = [
  {
    id: "1",
    name: "Sân bóng đá Mini Thống Nhất",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.8,
    location: "Quận 1, TP.HCM",
    price: "300.000đ",
  },
  {
    id: "4",
    name: "Sân bóng đá Rạch Miễu",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.3,
    location: "Quận Phú Nhuận, TP.HCM",
    price: "280.000đ",
  },
  {
    id: "5",
    name: "Sân bóng đá Kỳ Hòa",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.7,
    location: "Quận 10, TP.HCM",
    price: "320.000đ",
  },
];
