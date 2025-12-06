import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Text, ActivityIndicator, MD2Colors, Card } from "react-native-paper";
import { responsive } from "../../utils/responsive";
import TopNavigator from "../../components/TopNavigator";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ServerRoute } from "../../routes/ServerRoute";
import { COLORS } from "../../themes/colors";

type Community = {
  community_id: number;
  community_name: string;
};

type FeedItem = {
  id: string;
  type: "post" | "announcement";
  title: string;
  description: string;
  authorName?: string | null;
  avatarUrl?: string | null;
  createdAt: Date | null;
  image?: string | null;
};

export default function HomeScreen() {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const parseDate = (value: any): Date | null => {
    const maybe =
      value?.created_at ||
      value?.post_created_at ||
      value?.announcement_created_at ||
      value?.inserted_at ||
      value?.createdAt ||
      value;

    // Handle numeric (unix seconds/millis) or numeric strings
    if (typeof maybe === "number") {
      const millis = maybe > 1e12 ? maybe : maybe * 1000;
      const dNum = new Date(millis);
      return isNaN(dNum.getTime()) ? null : dNum;
    }

    if (typeof maybe === "string" && /^\d+$/.test(maybe)) {
      const millis = maybe.length > 12 ? Number(maybe) : Number(maybe) * 1000;
      const dNum = new Date(millis);
      return isNaN(dNum.getTime()) ? null : dNum;
    }

    const d = new Date(maybe);
    return isNaN(d.getTime()) ? null : d;
  };

  const fetchFeed = async (community: Community) => {
    try {
      setFeedLoading(true);
      setFeedError(null);

      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        setFeedError("You need to sign in to view community posts.");
        setFeedLoading(false);
        return;
      }

      const [postsRes, annRes] = await Promise.all([
        axios.get(`${ServerRoute}/get-community-posts`, {
          params: { communityID: community.community_id },
          headers: { Authorization: String(token) },
        }),
        axios.get(`${ServerRoute}/get-community-announcements`, {
          params: { communityID: community.community_id },
          headers: { Authorization: String(token) },
        }),
      ]);

      const posts = postsRes.data?.posts ?? [];
      const announcements = annRes.data?.announcements ?? [];

      const mappedPosts: FeedItem[] = posts.map((p: any) => ({
        id: `post-${p.post_id ?? p.id ?? Math.random()}`,
        type: "post",
        title: p.post_title ?? "Post",
        description: p.post_description ?? "",
        image: p.post_public_url ?? p.attachment_url ?? null,
        authorName:
          p.display_name ??
          p.profile_name ??
          p.author_name ??
          p.user_name ??
          p.full_name ??
          p.name ??
          p.profiles?.display_name ??
          "Member",
        avatarUrl:
          p.avatar_public_url ??
          p.profile_avatar_public_url ??
          p.user_avatar_public_url ??
          p.avatar_url ??
          p.profile_avatar_url ??
          p.profiles?.avatar_public_url ??
          null,
        createdAt: parseDate(p),
      }));

      const mappedAnnouncements: FeedItem[] = announcements.map((a: any) => ({
        id: `announcement-${a.announcement_id ?? a.id ?? Math.random()}`,
        type: "announcement",
        title: a.announcement_title ?? "Announcement",
        description: a.announcement_description ?? "",
        image: a.announcement_public_url ?? a.attachment_url ?? null,
        authorName:
          a.display_name ??
          a.profile_name ??
          a.author_name ??
          a.user_name ??
          a.full_name ??
          a.name ??
          a.profiles?.display_name ??
          "Member",
        avatarUrl:
          a.avatar_public_url ??
          a.profile_avatar_public_url ??
          a.user_avatar_public_url ??
          a.avatar_url ??
          a.profile_avatar_url ??
          a.profiles?.avatar_public_url ??
          null,
        createdAt: parseDate(a),
      }));

      const combined = [...mappedPosts, ...mappedAnnouncements].sort((a, b) => {
        const aTime = a.createdAt ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt ? b.createdAt.getTime() : 0;
        return bTime - aTime;
      });

      setFeedItems(combined);
    } catch (err: any) {
      setFeedError(err.response?.data?.message || "Could not load community feed.");
    } finally {
      setFeedLoading(false);
    }
  };

  const handleCommunitySelect = (community: Community) => {
    setSelectedCommunity(community);
    fetchFeed(community);
  };

  return (
    <View style={styles.screen}>
      <TopNavigator onCommunitySelect={handleCommunitySelect} />
      <ScrollView contentContainerStyle={styles.feedContainer}>
        {!selectedCommunity && (
          <Text style={styles.helperText}>Select a community to see its posts and announcements.</Text>
        )}
        {selectedCommunity && (
          <Text style={styles.selectedLabel}>
            Viewing: {selectedCommunity.community_name}
          </Text>
        )}
        {feedLoading && (
          <ActivityIndicator
            animating={feedLoading}
            color={MD2Colors.red800}
            size={responsive.number(50)}
          />
        )}
        {feedError && <Text style={styles.errorText}>{feedError}</Text>}
        {selectedCommunity && !feedLoading && !feedError && feedItems.length === 0 && (
          <Text style={styles.helperText}>No posts or announcements yet.</Text>
        )}
        {feedItems.map((item) => (
          <Card key={item.id} style={styles.feedCard}>
            <View style={styles.feedHeader}>
              <View style={styles.avatarPlaceholder}>
                {item.avatarUrl ? (
                  <Image
                    source={{ uri: item.avatarUrl }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarInitial}>
                    {item.authorName?.[0]?.toUpperCase() ?? "U"}
                  </Text>
                )}
              </View>
              <View style={styles.headerText}>
                <Text style={styles.authorName}>{item.authorName ?? "Member"}</Text>
                <Text style={styles.feedTimestamp}>
                  {item.createdAt ? item.createdAt.toLocaleString() : "Unknown date"}
                </Text>
              </View>
            </View>
            <Card.Content>
              <Text style={styles.feedTitle}>
                {item.title}
              </Text>
              <Text style={styles.feedDescription}>{item.description}</Text>
            </Card.Content>
            {item.image ? (
              <Card.Cover
                source={{ uri: item.image }}
                style={styles.feedImage}
                resizeMode="contain"
              />
            ) : null}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#D2C1B6",
  },
  feedContainer: {
    padding: responsive.number(16),
    gap: responsive.number(12),
  },
  helperText: {
    color: COLORS.text,
    textAlign: "center",
    marginTop: responsive.number(12),
  },
  selectedLabel: {
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: responsive.number(8),
  },
  errorText: {
    color: "#b00020",
    textAlign: "center",
  },
  feedCard: {
    backgroundColor: "#fff",
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: responsive.number(12),
    gap: responsive.number(10),
  },
  avatarPlaceholder: {
    width: responsive.number(40),
    height: responsive.number(40),
    borderRadius: responsive.number(20),
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarInitial: {
    fontWeight: "700",
    color: "#444",
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    fontWeight: "700",
    color: COLORS.primaryText,
  },
  feedImage: {
    height: responsive.number(320),
    backgroundColor: "#000",
  },
  feedTitle: {
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: responsive.number(6),
  },
  feedDescription: {
    color: COLORS.text,
    marginTop: responsive.number(6),
  },
  feedTimestamp: {
    color: COLORS.mutedText ?? "#666",
    marginTop: responsive.number(4),
    fontSize: responsive.fontSize(12),
  },
});
