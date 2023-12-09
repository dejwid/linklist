import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Chart from "@/components/Chart";
import SectionBox from "@/components/layout/SectionBox";
import {Event} from "@/models/Event";
import {Page} from "@/models/Page";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {differenceInDays, formatISO9075, isToday} from "date-fns";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";


export default async function AnalyticsPage() {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }
  const page = await Page.findOne({owner: session.user.email});

  const groupedViews = await Event.aggregate([
    {
      $match: {
        type: 'view',
        uri: page.uri,
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            date: "$createdAt",
            format: "%Y-%m-%d"
          },
        },
        count: {
          "$count": {},
        }
      },
    },
    {
      $sort: {_id: 1}
    }
  ]);

  const clicks = await Event.find({
    page: page.uri,
    type: 'click',
  });

  return (
    <div>
      <SectionBox>
        <h2 className="text-xl mb-6 text-center">Views</h2>
        <Chart data={groupedViews.map(o => ({
          'date': o._id,
          'views': o.count,
        }))} />
      </SectionBox>
      <SectionBox>
        <h2 className="text-xl mb-6 text-center">Clicks</h2>
        {page.links.map(link => (
          <div key={link.title} className="md:flex gap-4 items-center border-t border-gray-200 py-4">
            <div className="text-blue-500 pl-4">
              <FontAwesomeIcon icon={faLink} />
            </div>
            <div className="grow">
              <h3>{link.title || 'no title'}</h3>
              <p className="text-gray-700 text-sm">{link.subtitle || 'no description'}</p>
              <a className="text-xs text-blue-400" target="_blank" href="link.url">{link.url}</a>
            </div>
            <div className="text-center">
              <div className="border rounded-md p-2 mt-1 md:mt-0">
                <div className="text-3xl">
                  {
                    clicks
                      .filter(
                        c => c.uri === link.url
                          && isToday(c.createdAt)
                      )
                      .length
                  }
                </div>
                <div className="text-gray-400 text-xs uppercase font-bold">clicks today</div>
              </div>
            </div>
            <div className="text-center">
              <div className="border rounded-md p-2 mt-1 md:mt-0">
                <div className="text-3xl">
                  {clicks.filter(c => c.uri === link.url).length}
                </div>
                <div className="text-gray-400 text-xs uppercase font-bold">clicks total</div>
              </div>
            </div>
          </div>
        ))}
      </SectionBox>
    </div>
  );
}